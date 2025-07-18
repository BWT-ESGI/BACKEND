import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { RuleResultService } from './rule-result.service';

@ApiTags('Rule Results')
@Controller('rule-results')
export class RuleResultController {
  constructor(private readonly service: RuleResultService) {}

  @Get()
  @ApiOperation({ summary: 'Get all rule results' })
  @ApiResponse({ status: 200, description: 'List of all rule results.' })
  async findAll() {
    try {
      const results = await this.service.findAll();
      // Toujours renvoyer un tableau, même vide, pour compatibilité front
      return results;
    } catch (err) {
      console.error('Erreur lors de la récupération des RuleResults:', err);
      // Renvoyer un tableau vide en cas d'erreur pour éviter le 404 côté front
      return [];
    }
  }

  @Get('submission/:id')
  @ApiOperation({ summary: 'Get rule results by submission ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Rule results for submission.' })
  async findBySubmission(@Param('id') id: string) {
    try {
      const results = await this.service.findBySubmission(id);
      // Toujours renvoyer un tableau, même vide, pour compatibilité front
      return results;
    } catch (err) {
      console.error(
        `Erreur lors de la récupération des RuleResults pour la soumission ${id}:`,
        err,
      );
      // Renvoyer un tableau vide en cas d'erreur pour éviter le 404 côté front
      return [];
    }
  }

  @Get('rule/:id')
  @ApiOperation({ summary: 'Get rule results by rule ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Rule results for rule.' })
  async findByRule(@Param('id') id: string) {
    try {
      const results = await this.service.findByRule(id);
      if (!results || results.length === 0) {
        return {
          message: `Aucun résultat pour la règle ${id}.`,
          results: [],
        };
      }
      return { results };
    } catch (err) {
      console.error(
        `Erreur lors de la récupération des RuleResults pour la règle ${id}:`,
        err,
      );
      return {
        error: 'Erreur lors de la récupération des résultats de règles',
        details: err?.message || err,
      };
    }
  }

  @Get('project/:id')
  @ApiOperation({ summary: 'Get rule results by project ID' })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, description: 'Rule results for project.' })
  async findByProject(@Param('id') id: string) {
    try {
      const results = await this.service.findByProject(id);
      if (!results || results.length === 0) {
        return {
          message: `Aucun résultat pour le projet ${id}.`,
          results: [],
        };
      }
      return { results };
    } catch (err) {
      console.error(
        `Erreur lors de la récupération des RuleResults pour le projet
    ${id}:`,
        err,
      );
      return {
        error: 'Erreur lors de la récupération des résultats de règles',
        details: err?.message || err,
      };
    }
  }
}

